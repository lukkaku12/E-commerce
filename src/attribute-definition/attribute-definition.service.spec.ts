import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AttributeDefinitionService } from './attribute-definition.service';
import { AttributeDefinition } from './entities/attribute-definition.entity';

// Mocks
const mockAttributeDefinitionRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
};

describe('AttributeDefinitionService', () => {
  let service: AttributeDefinitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttributeDefinitionService,
        {
          provide: getRepositoryToken(AttributeDefinition),
          useValue: mockAttributeDefinitionRepository,
        },
      ],
    }).compile();

    service = module.get<AttributeDefinitionService>(
      AttributeDefinitionService,
    );
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debería crear y guardar una nueva definición de atributo', async () => {
    const mockDto = { name: 'Color', type: 'string' };
    const mockAttribute = { id: 1, ...mockDto };

    // Mockear `create` para devolver el objeto sin ID (como hace TypeORM antes de guardarlo)
    mockAttributeDefinitionRepository.create.mockReturnValue(mockDto);

    // Mockear `save` para devolver el objeto con ID (simulando una inserción exitosa en la DB)
    mockAttributeDefinitionRepository.save.mockResolvedValue(mockAttribute);

    const result = await service.create(mockDto);

    expect(mockAttributeDefinitionRepository.create).toHaveBeenCalledWith(
      mockDto,
    );

    expect(mockAttributeDefinitionRepository.save).toHaveBeenCalledWith(
      mockDto,
    );

    expect(result).toEqual(mockAttribute);
  });

  it('debería obtener todos los atributos', async () => {
    const mockAttributes = [{ id: 1 }, { id: 2 }];
    mockAttributeDefinitionRepository.find.mockResolvedValue(mockAttributes);

    const result = await service.findAll();
    expect(result).toEqual(mockAttributes);
  });

  it('deberia encontrar un solo atributo', async () => {
    const mockAttribute = { id: 1 };

    mockAttributeDefinitionRepository.findOne.mockResolvedValue(mockAttribute);

    const result = await service.findOne(1);
    expect(result).toEqual(mockAttribute);
  });

  it('debería actualizar un atributo', async () => {
    // Datos de prueba
    const id = 1;
    const mockAttribute = new AttributeDefinition();
    mockAttribute.attributeId = 1;
    mockAttribute.attributeName = 'Color';
    mockAttribute.dataType = 'string';
    const updateDto = { name: 'Updated Color' };
    const updatedAttribute = { ...mockAttribute, ...updateDto };

    // Mockeamos `findOne` para que devuelva un atributo existente
    jest.spyOn(service, 'findOne').mockResolvedValue(mockAttribute);

    // Mockeamos `save` para devolver el atributo actualizado
    mockAttributeDefinitionRepository.save.mockResolvedValue(updatedAttribute);

    // Llamamos al método que estamos testeando
    const result = await service.update(id, updateDto);

    // Verificamos que `findOne` se llamó con el ID correcto
    expect(service.findOne).toHaveBeenCalledWith(id);

    // Verificamos que `save` se llamó con el atributo modificado
    expect(mockAttributeDefinitionRepository.save).toHaveBeenCalledWith(
      updatedAttribute,
    );

    // Verificamos que el resultado sea el esperado
    expect(result).toEqual(updatedAttribute);
  });

  it('debería eliminar un atributo correctamente', async () => {
    const id = 1;

    // Simula que la operación afectó 1 fila (atributo eliminado correctamente)
    mockAttributeDefinitionRepository.delete.mockResolvedValue({ affected: 1 });

    // Llamamos al método `remove()`
    await service.remove(id);

    // Verificamos que `delete(id)` se llamó con el ID correcto
    expect(mockAttributeDefinitionRepository.delete).toHaveBeenCalledWith(id);
  });
});
