export interface Knowledge{
    id: string;
    uid: string;
    name:string;
    email:string;
    image: string;
    urls:Object;
    text_field: string;
    createdAt: string;
    updateAt: string;
}

export interface KnowledgeResponse{
    knowledges:Knowledge[];
}