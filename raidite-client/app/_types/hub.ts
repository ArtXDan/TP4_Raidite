export class Hub{
    constructor(
        public id : number, 
        public name : string, 
        public isJoined : boolean | null,
        public fileName : string | null,
        public mimeType : string | null
    ){}
}