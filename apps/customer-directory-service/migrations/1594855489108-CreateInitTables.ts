import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateInitTables1594855489108 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'customer',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            default: 'uuid_generate_v4()',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            width: 512,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
    await queryRunner.createTable(
      new Table({
        name: 'contact',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            default: 'uuid_generate_v4()',
            isPrimary: true,
          },
          {
            name: 'customerId',
            type: 'uuid',
          },
          {
            name: 'type',
            type: 'int',
          },
          {
            name: 'value',
            type: 'text',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        indices: [
          {
            columnNames: ['type'],
            name: 'IDX_type',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['customerId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'customer',
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
    await queryRunner.createTable(
      new Table({
        name: 'address',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            default: 'uuid_generate_v4()',
            isPrimary: true,
          },
          {
            name: 'customerId',
            type: 'uuid',
          },
          {
            name: 'line',
            type: 'text',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['customerId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'customer',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
    await queryRunner.createTable(
      new Table({
        name: 'note',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            default: 'uuid_generate_v4()',
            isPrimary: true,
          },
          {
            name: 'customerId',
            type: 'uuid',
          },
          {
            name: 'contents',
            type: 'text',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['customerId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'customer',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('customer', true);
    await queryRunner.dropTable('contact', true);
    await queryRunner.dropTable('address', true);
    await queryRunner.dropTable('note', true);
  }
}
