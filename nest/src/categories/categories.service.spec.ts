import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: jest.Mocked<Partial<Repository<Category>>>;

  beforeEach(async () => {
    repository = {
      find: jest.fn().mockResolvedValue([{ id: 1, title: 'Food' }, { id: 2, title: 'Clothing' }]), // Mocked data
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: getRepositoryToken(Category),
        useValue: repository,
      },
      CategoriesService],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  


  describe('isAdult', () => {
    it('should return true if age is at least 18', () => {
      expect(service.isAdult(18)).toBe(true);
    })
    it('should return false when age is 17', () => {
      expect(service.isAdult(17)).toBe(false);
    })
    it('should return false when age is 17.9', () => {
      expect(service.isAdult(17.9)).toBe(false);
    });
    it('should throw exception when age is negative', () => {
      expect(() => service.isAdult(-1)).toThrow();
    })
  })

  it('should return an array of categories', async () => {
    const result = await service.findAll();
    expect(result).toEqual([{ id: 1, title: 'Food' }, { id: 2, title: 'Clothing' }]);
    expect(repository.find).toHaveBeenCalledTimes(1);
    expect(repository.find).not.toHaveBeenCalledWith(expect.objectContaining({ where: expect.anything() })); // Ensure no where clause
  });

});
