package util

import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime
import kotlin.time.Clock
import kotlin.time.ExperimentalTime
import kotlin.time.Instant

@OptIn(ExperimentalTime::class)
fun now() = Clock.System.now().toLocalDateTime(TimeZone.UTC)

@OptIn(ExperimentalTime::class)
fun timestampToLocalDateTime(timestampMillis: Long): LocalDateTime {
    return Instant.fromEpochMilliseconds(timestampMillis)
        .toLocalDateTime(TimeZone.currentSystemDefault())
}
