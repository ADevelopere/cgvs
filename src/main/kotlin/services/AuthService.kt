package services

import at.favre.lib.crypto.bcrypt.BCrypt
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import kotlinx.datetime.Clock
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime
import models.User
import models.Session
import repositories.UserRepository
import repositories.SessionRepository
import java.util.*

class AuthService(
    private val userRepository: UserRepository,
    private val sessionRepository: SessionRepository,
    private val jwtSecret: String,
    private val jwtDomain: String,
    private val jwtAudience: String
) {

    suspend fun authenticateUser(email: String, password: String): User? {
        val user = userRepository.findByEmail(email)
        return if (user != null && BCrypt.verifyer().verify(password.toCharArray(), user.password.toCharArray()).verified) {
            user
        } else {
            null
        }
    }

    suspend fun registerUser(name: String, email: String, password: String): User? {
        // Check if user already exists
        val existingUser = userRepository.findByEmail(email)
        if (existingUser != null) {
            return null
        }

        val hashedPassword = hashPassword(password)
        val now = Clock.System.now().toLocalDateTime(TimeZone.UTC)

        val newUser = User(
            name = name,
            email = email,
            password = hashedPassword,
            createdAt = now,
            updatedAt = now
        )

        return userRepository.create(newUser)
    }

     fun generateJWT(user: User): String {
        return JWT.create()
            .withSubject("Authentication")
            .withIssuer(jwtDomain)
            .withAudience(jwtAudience)
            .withClaim("userId", user.id)
            .withClaim("email", user.email)
            .withClaim("isAdmin", user.isAdmin)
            .withExpiresAt(Date(System.currentTimeMillis() + 3600000)) // 1 hour
            .sign(Algorithm.HMAC256(jwtSecret))
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
            lastActivity = now
        )

        return sessionRepository.create(session)
    }

    suspend fun validateSession(sessionId: String): Session? {
        val session = sessionRepository.findById(sessionId)
        return if (session != null && !isSessionExpired(session)) {
            // Update last activity
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
        val sessionTimeout = 3600 // 1 hour in seconds
        return (now - session.lastActivity) > sessionTimeout
    }

    suspend fun cleanupExpiredSessions() {
        val cutoffTime = (Clock.System.now().epochSeconds - 3600).toInt() // 1 hour ago
        sessionRepository.deleteExpired(cutoffTime)
    }
}
