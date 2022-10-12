import { Injectable } from '@nestjs/common';
import { SupportedFileMimeTypesEnum } from '@impler/shared';
import { ColumnRepository, TemplateRepository } from '@impler/dal';
import { UpdateColumnCommand } from './update-columns.command';
import { CSVFileService } from '../../../shared/file/file.service';
import { StorageService } from '../../../shared/storage/storage.service';
import { FileNameService } from '../../../shared/file/name.service';

@Injectable()
export class UpdateColumns {
  constructor(
    private columnRepository: ColumnRepository,
    private csvFileService: CSVFileService,
    private storageService: StorageService,
    private fileNameService: FileNameService,
    private templateRepository: TemplateRepository
  ) {}

  async execute(command: UpdateColumnCommand[], templateId: string) {
    await this.columnRepository.delete({ templateId });
    this.saveSampleFile(command, templateId);

    return this.columnRepository.createMany(command);
  }

  async saveSampleFile(data: UpdateColumnCommand[], templateId: string) {
    const csvContent = this.createCSVFileHeadingContent(data);
    const fileName = this.fileNameService.getSampleFileName(templateId);
    const sampleFileUrl = this.fileNameService.getSampleFileUrl(templateId);
    this.storageService.uploadFile(fileName, csvContent, SupportedFileMimeTypesEnum.CSV, true);
    await this.templateRepository.update({ _id: templateId }, { sampleFileUrl });
  }

  createCSVFileHeadingContent(data: UpdateColumnCommand[]): string {
    const headings = data.map((column) => column.columnKeys[0]);

    return headings.join(',');
  }
}