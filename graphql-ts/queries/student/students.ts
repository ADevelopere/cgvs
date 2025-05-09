import { gql } from '@apollo/client';

export const STUDENTS = gql`
query students($birth_from: DateTime, $birth_to: DateTime, $created_from: DateTime, $created_to: DateTime, $email: String, $first: Int!, $gender: StudentGender, $name: String, $nationality: CountryCode, $orderBy: [OrderByClause!], $page: Int, $phone_number: String){
    students(birth_from: $birth_from, birth_to: $birth_to, created_from: $created_from, created_to: $created_to, email: $email, first: $first, gender: $gender, name: $name, nationality: $nationality, orderBy: $orderBy, page: $page, phone_number: $phone_number){
        data{
            id
            name
            gender
            nationality
            date_of_birth
            email
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
