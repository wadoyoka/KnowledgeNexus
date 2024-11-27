export interface Knowledge{
    id: string;
    name:string;
    text_field: string;
}

export interface KnowledgeResponse{
    knowledges:Knowledge[];
}