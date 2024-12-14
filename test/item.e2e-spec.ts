import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ItemsModule } from '../src/items/items.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';

describe('ItemsController (e2e)', () => {
  let app: INestApplication;

  const mockItems = [
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
    {
      id: 7,
      name: 'Item with tags + events 2',
      public: true,
    },
  ];

  const mockItemsRepository = {
    findAll: jest.fn().mockResolvedValue(mockItems),
  };

  beforeEach(async () => {
    // const moduleFixture: TestingModule = await Test.createTestingModule({
    //   imports: [AppModule],
    // }).compile();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ItemsModule],
    })
      .overrideProvider(getRepositoryToken(Item))
      .useValue(mockItemsRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    // app.setGlobalPrefix('api');
    await app.init();
  });

  it('/items (GET)', () => {
    return request(app.getHttpServer()).get('/items').expect(200);
  });

  it('/items (POST)', () => {
    return request(app.getHttpServer())
      .post('/items')
      .send({
        name: 'Item with tags + events 3',
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
      })
      .expect(201);
  });

  it('/items (POST) --> 400 on validation error', () => {
    return request(app.getHttpServer())
      .post('/items')
      .send({
        name: 'Item with tags + events 3',
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
      })
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['description must be a string'],
        error: 'Bad Request',
      });
  });
});
