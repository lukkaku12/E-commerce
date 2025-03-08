import { Test, TestingModule } from '@nestjs/testing';
import { VariantAttributesService } from './variant-attributes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { VariantAttribute } from './entities/variant-attribute.entity';
import { UserRole } from 'src/users/entities/user.entity';
import { Service } from 'src/services/entities/service.entity';

const mockRepository = {
  create: jest.fn().mockImplementation(dto => dto),
  save: jest.fn().mockImplementation(entity => Promise.resolve({ id: 1, ...entity })),
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockImplementation(({ where: { id } }) =>
    id === 1 ? Promise.resolve({ id, name: 'Size' }) : Promise.resolve(null),
  ),
  update: jest.fn().mockResolvedValue({ affected: 1 }),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
};

describe('VariantAttributesService', () => {
  let service: VariantAttributesService;
  let repository: Repository<VariantAttribute>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VariantAttributesService,
        {
          provide: getRepositoryToken(VariantAttribute),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<VariantAttributesService>(VariantAttributesService);
    repository = module.get<Repository<VariantAttribute>>(getRepositoryToken(VariantAttribute));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new variant attribute', async () => {
    const dto = { name: 'Color' };
    expect(await service.create(dto)).toEqual({ id: 1, name: 'Color' });
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalled();
  });

  it('should return all variant attributes', async () => {
    expect(await service.findAll()).toEqual([]);
    expect(repository.find).toHaveBeenCalled();
  });

//   it('should update a variant attribute', async () => {
//     const dto = { name: 'Updated Name', attributeValue: 'Color' };
  
//     jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1 } as any);
  
//     jest.spyOn(repository, 'findOne').mockResolvedValue({
//     attributeDefinition: 1,
//     productVariant: 1,
//       attributeId: 1,
//       attributeValue: 'Updated Name',
//       VariantAttribute: 'Color',
//     } as VariantAttribute);
  
//     const updatedAttribute = await service.update(1, dto);
  
//     expect(updatedAttribute).toEqual(
//       expect.objectContaining({
//         id: 1,
//         variantId: 1,
//         attributeId: 1,
//         name: 'Updated Name',
//         attributeValue: 'Color',
//       })
//     );
  
//     expect(repository.update).toHaveBeenCalledWith(1, dto);
//   });

//   it('should delete a variant attribute', async () => {
//     jest.spyOn(repository, 'findOne').mockResolvedValue({
//       variantId: 1,
//       attributeId: 1,
//       attributeValue: 'Color',
//     } as VariantAttribute);
      
//     jest.spyOn(repository, 'remove').mockResolvedValue(undefined); // remove no devuelve nada
  
//     await expect(service.remove(1)).resolves.toBeUndefined();
  
//     expect(repository.findOne).toHaveBeenCalledWith({ where: { variantId: 1 } }); // Usa variantId
//     expect(repository.remove).toHaveBeenCalledWith({
//       variantId: 1,
//       attributeId: 1,
//       attributeValue: 'Color',
//     }); // remove necesita el objeto, no solo el ID
//   });
});