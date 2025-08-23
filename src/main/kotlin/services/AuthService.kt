package services

import at.favre.lib.crypto.bcrypt.BCrypt
import com.auth0.jwt.JWTCreator
import com.auth0.jwt.algorithms.Algorithm
import di.JwtConfig
import kotlinx.datetime.Clock
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime
import repositories.SessionRepository
import repositories.UserRepository
import schema.model.RegisterInput
import schema.model.Session
import schema.model.User
import java.util.*

class AuthService(
    private val userRepository: UserRepository,
    private val sessionRepository: SessionRepository,
    private val jwtConfig: JwtConfig,
    private val jwtBuilder: JWTCreator.Builder
) {
    suspend fun authenticateUser(email: String, password: String): User? {
        val user = userRepository.findByEmail(email)
        return if (user != null && BCrypt.verifyer()
                .verify(password.toCharArray(), user.password.toCharArray()).verified
        ) {
            user
        } else {
            null
        }
    }

    suspend fun registerUser(input: RegisterInput): User? {
        // Check if user already exists
        val existingUser = userRepository.findByEmail(input.email.value)
        if (existingUser != null) {
            return null
        }

        val hashedPassword = hashPassword(input.password)
        val now = Clock.System.now().toLocalDateTime(TimeZone.UTC)

        val newUser = User(
            name = input.name,
            email = input.email,
            password = hashedPassword,
            createdAt = now,
            updatedAt = now,
        )

        return userRepository.create(newUser)
    }

    fun generateAccessToken(user: User): String {
        return jwtBuilder
            .withSubject("Authentication")
            .withClaim("userId", user.id)
            .withClaim("email", user.email.value)
            .withClaim("isAdmin", user.isAdmin)
            .withExpiresAt(Date(System.currentTimeMillis() + 900000)) // 15 minutes
            .sign(Algorithm.HMAC256(jwtConfig.secret))
    }

    suspend fun refreshAccessToken(refreshToken: String): String? {
        val user = getUserFromSession(refreshToken)
        return if (user != null) {
            generateAccessToken(user)
        } else {
            null
        }
    }

    suspend fun createSession(user: User, ipAddress: String?, userAgent: String?): Session {
        val sessionId = generateSessionId()
        val now = (Clock.System.now().epochSeconds).toInt()

        val session = Session(
            id = sessionId,
            userId = user.id,
            ipAddress = ipAddress,
            userAgent = userAgent,
            payload = "authenticated",
            lastActivity = now,
        )

        return sessionRepository.create(session)
    }

    suspend fun validateSession(sessionId: String): Session? {
        val session = sessionRepository.findById(sessionId)
        return if (session != null && !isSessionExpired(session)) {
            // Update last activity to keep the refresh token alive
            val now = (Clock.System.now().epochSeconds).toInt()
            sessionRepository.updateLastActivity(sessionId, now)
            session
        } else {
            null
        }
    }

    suspend fun invalidateSession(sessionId: String): Boolean {
        return sessionRepository.delete(sessionId)
    }

    suspend fun invalidateAllUserSessions(userId: Int): Boolean {
        return sessionRepository.deleteByUser(userId)
    }

    suspend fun getUserFromSession(sessionId: String): User? {
        val session = validateSession(sessionId)
        return if (session?.userId != null) {
            userRepository.findById(session.userId)
        } else {
            null
        }
    }

    suspend fun getUserById(userId: Int): User? {
        return userRepository.findById(userId)
    }

    private fun hashPassword(password: String): String {
        return BCrypt.withDefaults().hashToString(12, password.toCharArray())
    }

    private fun generateSessionId(): String {
        return UUID.randomUUID().toString().replace("-", "")
    }

    private fun isSessionExpired(session: Session): Boolean {
        val now = Clock.System.now().epochSeconds.toInt()
        val sessionTimeout = 604800 // 7 days in seconds
        return (now - session.lastActivity) > sessionTimeout
    }

    suspend fun cleanupExpiredSessions() {
        val cutoffTime = (Clock.System.now().epochSeconds - 604800).toInt() // 7 days ago
        sessionRepository.deleteExpired(cutoffTime)
    }
}
