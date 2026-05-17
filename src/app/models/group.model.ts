export interface Member {
    name: string;
}

export interface Group {
    id: string;
    subject: string;
    groupNumber: string;
    members: Member[];
    leaderIndex: number;
    notes: string;
}
