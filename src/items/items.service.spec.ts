import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Listing } from './entities/listing.entity';
import { Tag } from './entities/tag.entity';
import { EntityManager } from 'typeorm';

describe('ItemsService', () => {
  let service: ItemsService;
  const mockItemsRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    findAll: jest.fn().mockImplementation(() => {
      return [
        { id: 1, name: 'First Item', public: true },
        { id: 3, name: 'Complex Item', public: true },
        { id: 4, name: 'Complex Item with Comment', public: true },
        { id: 5, name: 'Item with tags', public: true },
        { id: 6, name: 'Item with tags + events', public: true },
        { id: 7, name: 'Item with tags + events 2', public: true },
      ];
    }),
    find: jest.fn().mockImplementation(() => {
      return Promise.resolve([
        { id: 1, name: 'First Item', public: true },
        { id: 3, name: 'Complex Item', public: true },
        { id: 4, name: 'Complex Item with Comment', public: true },
        { id: 5, name: 'Item with tags', public: true },
        { id: 6, name: 'Item with tags + events', public: true },
        { id: 7, name: 'Item with tags + events 2', public: true },
      ]);
    }),
  };

  const mockItemsEntityManager = {
    save: jest.fn().mockImplementation((item) => {
      const randomId = Math.floor(Math.random() * 1000) + 1;

      // Ensure Listing and Tag are instances of their classes
      const mockListing = new Listing({
        ...item.listing,
        id: randomId,
        rating: 0,
      });
      const mockTags = item.tags.map(
        (tagDto) => new Tag({ ...tagDto, id: randomId }),
      );

      return Promise.resolve({
        id: randomId,
        ...item,
        listing: mockListing,
        tags: mockTags,
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: getRepositoryToken(Item),
          useValue: mockItemsRepository,
        },
        {
          provide: EntityManager,
          useValue: mockItemsEntityManager,
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new item record and return that', async () => {
    const createItemDto = {
      name: 'Item with tags + events',
      public: true,
      tags: [
        {
          content: 'Blue',
        },
        {
          content: 'Large',
        },
        {
          content: 'PC',
        },
      ],
      listing: {
        description: 'Item with some tags',
      },
    };

    const item = {
      id: expect.any(Number),
      name: 'Item with tags + events',
      public: true,
      listing: {
        id: expect.any(Number),
        description: 'Item with some tags',
        rating: 0,
      },
      comments: [],
      tags: [
        {
          id: expect.any(Number),
          content: 'Blue',
        },
        {
          id: expect.any(Number),
          content: 'Large',
        },
        {
          id: expect.any(Number),
          content: 'PC',
        },
      ],
    };

    expect(await service.create(createItemDto)).toEqual(item);
  });

  it('it should return all items', async () => {
    const result = await service.findAll();

    expect(mockItemsRepository.find).toHaveBeenCalled();
    expect(result).toEqual([
      { id: 1, name: 'First Item', public: true },
      { id: 3, name: 'Complex Item', public: true },
      { id: 4, name: 'Complex Item with Comment', public: true },
      { id: 5, name: 'Item with tags', public: true },
      { id: 6, name: 'Item with tags + events', public: true },
      { id: 7, name: 'Item with tags + events 2', public: true },
    ]);
  });
});
