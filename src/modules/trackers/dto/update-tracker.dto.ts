import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackerDto } from './create-tracker.dto';

export class UpdateTrackerDto extends PartialType(CreateTrackerDto) {}
