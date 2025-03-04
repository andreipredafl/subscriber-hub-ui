export interface Field {
    id?: number
    title: string
    type: string
}

export interface PaginatedResponse {
    data: Field[]
    current_page: number
    per_page: number
    total: number
    last_page: number
}
