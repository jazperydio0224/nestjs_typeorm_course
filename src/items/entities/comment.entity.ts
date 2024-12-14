import { AbstractEntity } from 'src/database/abstract.entity';
import { Item } from './item.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class Comment extends AbstractEntity<Comment> {
  @Column()
  content: string;

  @ManyToOne(() => Item, (item) => item.comments)
  item: Item;
}
