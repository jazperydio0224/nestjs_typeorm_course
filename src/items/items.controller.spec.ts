import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

describe('ItemsController', () => {
  let controller: ItemsController;

  const mockItemsService = {
    create: jest.fn((dto) => {
      const randomId = Math.floor(Math.random() * 1000) + 1;
      return {
        id: randomId,
        ...dto,
      };
    }),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    findAll: jest.fn(() => [
      {
        id: 1,
        name: 'First Item',
        public: true,
      },
      {
        id: 3,
        name: 'Complex Item',
        public: true,
      },
      {
        id: 4,
        name: 'Complex Item with Comment',
        public: true,
      },
      {
        id: 5,
        name: 'Item with tags',
        public: true,
      },
      {
        id: 6,
        name: 'Item with tags + events',
        public: true,
      },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [ItemsService],
    })
      .overrideProvider(ItemsService)
      .useValue(mockItemsService)
      .compile();

    controller = module.get<ItemsController>(ItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an item', () => {
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

    expect(controller.create(createItemDto)).toEqual({
      id: expect.any(Number),
      ...createItemDto,
    });

    expect(mockItemsService.create).toHaveBeenCalled();

    expect(mockItemsService.create).toHaveBeenCalledWith(createItemDto);
  });

  it('should update an item', () => {
    const updateItemDto = {
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
      comments: [
        {
          content: 'Comment 1',
        },
      ],
    };

    expect(controller.update(1, updateItemDto)).toEqual({
      id: 1,
      ...updateItemDto,
    });

    expect(mockItemsService.update).toHaveBeenCalled();

    expect(mockItemsService.update).toHaveBeenCalledWith(1, updateItemDto);
  });

  it('should return all items', () => {
    const allItems = [
      {
        id: 1,
        name: 'First Item',
        public: true,
      },
      {
        id: 3,
        name: 'Complex Item',
        public: true,
      },
      {
        id: 4,
        name: 'Complex Item with Comment',
        public: true,
      },
      {
        id: 5,
        name: 'Item with tags',
        public: true,
      },
      {
        id: 6,
        name: 'Item with tags + events',
        public: true,
      },
    ];

    const result = controller.findAll();
    expect(result).toEqual(allItems);
    expect(mockItemsService.findAll).toHaveBeenCalled();
  });
});
