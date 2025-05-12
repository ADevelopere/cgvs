import { gql } from '@apollo/client';

export const STUDENTS = gql`
query students($birth_date: DateTime, $birth_date_after: DateTime, $birth_date_before: DateTime, $birth_date_from: DateTime, $birth_date_is_empty: Boolean, $birth_date_is_not_empty: Boolean, $birth_date_not: DateTime, $birth_date_on_or_after: DateTime, $birth_date_on_or_before: DateTime, $birth_date_to: DateTime, $created_at: DateTime, $created_at_after: DateTime, $created_at_before: DateTime, $created_at_from: DateTime, $created_at_is_empty: Boolean, $created_at_is_not_empty: Boolean, $created_at_not: DateTime, $created_at_on_or_after: DateTime, $created_at_on_or_before: DateTime, $created_at_to: DateTime, $email: String, $email_ends_with: String, $email_equals: String, $email_is_empty: Boolean, $email_is_not_empty: Boolean, $email_not_contains: String, $email_not_equals: String, $email_starts_with: String, $first: Int!, $gender: StudentGender, $name: String, $name_ends_with: String, $name_equals: String, $name_is_empty: Boolean, $name_is_not_empty: Boolean, $name_not_contains: String, $name_not_equals: String, $name_starts_with: String, $nationality: CountryCode, $orderBy: [OrderByClause!], $page: Int, $phone_number: String){
    students(birth_date: $birth_date, birth_date_after: $birth_date_after, birth_date_before: $birth_date_before, birth_date_from: $birth_date_from, birth_date_is_empty: $birth_date_is_empty, birth_date_is_not_empty: $birth_date_is_not_empty, birth_date_not: $birth_date_not, birth_date_on_or_after: $birth_date_on_or_after, birth_date_on_or_before: $birth_date_on_or_before, birth_date_to: $birth_date_to, created_at: $created_at, created_at_after: $created_at_after, created_at_before: $created_at_before, created_at_from: $created_at_from, created_at_is_empty: $created_at_is_empty, created_at_is_not_empty: $created_at_is_not_empty, created_at_not: $created_at_not, created_at_on_or_after: $created_at_on_or_after, created_at_on_or_before: $created_at_on_or_before, created_at_to: $created_at_to, email: $email, email_ends_with: $email_ends_with, email_equals: $email_equals, email_is_empty: $email_is_empty, email_is_not_empty: $email_is_not_empty, email_not_contains: $email_not_contains, email_not_equals: $email_not_equals, email_starts_with: $email_starts_with, first: $first, gender: $gender, name: $name, name_ends_with: $name_ends_with, name_equals: $name_equals, name_is_empty: $name_is_empty, name_is_not_empty: $name_is_not_empty, name_not_contains: $name_not_contains, name_not_equals: $name_not_equals, name_starts_with: $name_starts_with, nationality: $nationality, orderBy: $orderBy, page: $page, phone_number: $phone_number){
        data{
            id
            name
            email
            gender
            nationality
            date_of_birth
            phone_number
            created_at
            updated_at
        }
        paginatorInfo{
            count
            currentPage
            firstItem
            hasMorePages
            lastItem
            lastPage
            perPage
            total
        }
    }
}
`;
