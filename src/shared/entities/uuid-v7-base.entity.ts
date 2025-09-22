import { BaseEntity, BeforeInsert, PrimaryColumn } from 'typeorm';
import { v7 } from 'uuid';

export abstract class UUIDV7BaseEntity extends BaseEntity {
     @PrimaryColumn()
     id: string;

     @BeforeInsert()
     generateUUID() {
          this.id = v7();
     }
}
