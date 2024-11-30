export interface Knowledge{
    id: string;
    name:string;
    email:string;
    urls:Object;
    text_field: string;
    createdAt: string;
    updateAt: string;
}

export interface KnowledgeResponse{
    knowledges:Knowledge[];
}