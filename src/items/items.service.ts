import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { EntityManager, Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { Listing } from './entities/listing.entity';
import { Comment } from './entities/comment.entity';
import { Tag } from './entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const listing = new Listing({
      ...createItemDto.listing,
      rating: 0,
    });

    const tags = createItemDto.tags.map(
      (createTagDto) => new Tag(createTagDto),
    );

    const item = new Item({
      ...createItemDto,
      comments: [],
      tags,
      listing,
    });

    const insertedItem = await this.entityManager.save(item);
    return insertedItem;
  }

  async findAll() {
    const allItems = await this.itemsRepository.find();
    console.log(allItems);

    return allItems;
  }

  async findOne(id: number) {
    return await this.itemsRepository.findOne({
      where: { id },
      relations: { listing: true, comments: true, tags: true },
    });
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const item = await this.itemsRepository.findOneBy({ id });
    item.public = updateItemDto.public;
    const comments = updateItemDto.comments.map(
      (createCommentDto) => new Comment(createCommentDto),
    );
    item.comments = comments;
    return await this.entityManager.save(item);

    // await this.entityManager.transaction(async (entityManager) => {
    //   try {
    //     const item = await this.itemsRepository.findOneBy({ id });
    //     item.public = updateItemDto.public;

    //     const comments = updateItemDto.comments.map(
    //       (createCommentDto) => new Comment(createCommentDto),
    //     );
    //     item.comments = comments;
    //     await entityManager.save(item);
    //     throw new Error('Transaction failed');

    //     const tagContent = `${Math.random()}`;
    //     const tag = new Tag({ content: tagContent });
    //     await entityManager.save(tag);
    //   } catch (error) {
    //     console.error('Transaction failed:', error);
    //     throw error; // Rethrow to ensure rollback
    //   }
    // });
  }

  async remove(id: number) {
    await this.itemsRepository.delete(id);
  }
}
