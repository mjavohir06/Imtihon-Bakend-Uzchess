import { IsNotEmpty,  IsString} from "class-validator";


export class Create_News{
    @IsString()
    @IsNotEmpty()
    title:string

    @IsString()
    @IsNotEmpty()
    
    caption:string

    @IsString()
    @IsNotEmpty()
    date:string

    @IsString()
    @IsNotEmpty()
    HtmlText:string
}