package util

import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime

fun now() = Clock.System.now().toLocalDateTime(TimeZone.UTC)

fun timestampToLocalDateTime(timestampMillis: Long): LocalDateTime {
    return Instant.fromEpochMilliseconds(timestampMillis)
        .toLocalDateTime(TimeZone.Companion.currentSystemDefault())
}
