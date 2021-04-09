export interface File {
    id: string,
    name: string,
    savedPath: string,
    entrys: Entry[]
}

export interface Entry {
    groupName: string,
    logo: string,
    name: string,
    fileName: string,
    language: string,
    contry: string,
    url: string,
}

export interface Filter {
    groupName?: string;
    includeKeywords?: string[];
    excludeKeywords?: string[];
}

/*
model File {
    id Int @id @default(autoincrement())
    name String
    entrys Entry[]
  }
  
  model Group {
    name String @id
    entrys Entry[]
  }
  
  model Entry {
    id Int @id @default(autoincrement())
    file File @relation(fields: [fileId], references: [id])
    fileId Int
    group Group @relation(fields: [groupName], references: [name])
    groupName String
    logo String
    name String
    url String
  }
  
  model Filter {
    id Int @id @default(autoincrement())
    groupName String?
    includeKeyword String[]
    excludeKeyword String[]
  }
  */