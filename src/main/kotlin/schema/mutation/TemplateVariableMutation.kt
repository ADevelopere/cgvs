package schema.mutation

import com.expediagroup.graphql.server.operations.Mutation
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import schema.type.*
import services.TemplateVariableService

@Suppress("unused")
class TemplateVariableMutation : Mutation, KoinComponent {
	private val service: TemplateVariableService by inject()

	suspend fun createTextTemplateVariable(input: CreateTextCreateTemplateVariableInput): TextTemplateVariable {
		return service.createTextTemplateVariable(input)
	}

	suspend fun updateTextTemplateVariable(input: UpdateTextCreateTemplateVariableInput): TextTemplateVariable {
		return service.updateTextTemplateVariable(input)
	}

	suspend fun createNumberTemplateVariable(input: CreateNumberCreateTemplateVariableInput): NumberTemplateVariable {
		return service.createNumberTemplateVariable(input)
	}

	suspend fun updateNumberTemplateVariable(input: UpdateNumberCreateTemplateVariableInput): NumberTemplateVariable {
		return service.updateNumberTemplateVariable(input)
	}

	suspend fun createDateTemplateVariable(input: CreateDateCreateTemplateVariableInput): DateTemplateVariable {
		return service.createDateTemplateVariable(input)
	}

	suspend fun updateDateTemplateVariable(input: UpdateDateCreateTemplateVariableInput): DateTemplateVariable {
		return service.updateDateTemplateVariable(input)
	}

	suspend fun createSelectTemplateVariable(input: CreateSelectCreateTemplateVariableInput): SelectTemplateVariable {
		return service.createSelectTemplateVariable(input)
	}

	suspend fun updateSelectTemplateVariable(input: UpdateSelectCreateTemplateVariableInput): SelectTemplateVariable {
		return service.updateSelectTemplateVariable(input)
	}

	suspend fun deleteTemplateVariable(id: Int): TemplateVariable {
		return service.deleteTemplateVariable(id)
	}
}
