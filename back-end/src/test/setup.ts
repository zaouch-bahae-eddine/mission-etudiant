import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module.js';

let moduleRef: TestingModule;

beforeAll(async () => {
  moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  await moduleRef.init();
});

afterAll(async () => {
  await moduleRef?.close();
});

export function getTestingModule(): TestingModule {
  return moduleRef;
}
