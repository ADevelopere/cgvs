package schema.mutation

import com.expediagroup.graphql.server.operations.Mutation
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import schema.type.*
import services.TemplateVariableService

@Suppress("unused")
class TemplateVariableMutation : Mutation, KoinComponent {
	private val service: TemplateVariableService by inject()

	suspend fun createTextTemplateVariable(input: CreateTextTemplateVariableInput): TextTemplateVariable {
		return service.createTextTemplateVariable(input)
	}

	suspend fun updateTextTemplateVariable(input: UpdateTextTemplateVariableInput): TextTemplateVariable {
		return service.updateTextTemplateVariable(input)
	}

	suspend fun createNumberTemplateVariable(input: CreateNumberTemplateVariableInput): NumberTemplateVariable {
		return service.createNumberTemplateVariable(input)
	}

	suspend fun updateNumberTemplateVariable(input: UpdateNumberTemplateVariableInput): NumberTemplateVariable {
		return service.updateNumberTemplateVariable(input)
	}

	suspend fun createDateTemplateVariable(input: CreateDateTemplateVariableInput): DateTemplateVariable {
		return service.createDateTemplateVariable(input)
	}

	suspend fun updateDateTemplateVariable(input: UpdateDateTemplateVariableInput): DateTemplateVariable {
		return service.updateDateTemplateVariable(input)
	}

	suspend fun createSelectTemplateVariable(input: CreateSelectTemplateVariableInput): SelectTemplateVariable {
		return service.createSelectTemplateVariable(input)
	}

	suspend fun updateSelectTemplateVariable(input: UpdateSelectTemplateVariableInput): SelectTemplateVariable {
		return service.updateSelectTemplateVariable(input)
	}

	suspend fun deleteTemplateVariable(id: Int): TemplateVariable {
		return service.deleteTemplateVariable(id)
	}
}
