import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as os from 'os';

@Injectable()
export class Base64FileUploadToFileStrategy implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const body = request.body;

        if (body.file) {
            const fileName = `${os.tmpdir()}/${randomUUID()}-${body.name}`;
            const buff = Buffer.from(body.file.replace(/^data:application\/pdf;base64,/, ""), 'base64');
            fs.writeFileSync(fileName, buff);
    
            request.fileName = fileName;
        }

        return true;
    }

}