import {IsMongoId} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class ScheduleParamsDto {
    @IsMongoId()
    @ApiProperty()
    scheduleId: string;
}