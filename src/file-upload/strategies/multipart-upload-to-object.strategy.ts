import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as Busboy from 'busboy';

@Injectable()
export class MultipartUploadToObjectStrategy implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        return new Promise((resolve, reject) => {
            const bb = Busboy({headers: request.headers});
        
            bb.on('field', (name, val, info) => {
                request.body = JSON.parse(val);
                resolve(true);
            });
            bb.on('error', (e) => {
                reject(new BadRequestException("Erro no upload do arquivo"));
            });
            if (request.rawBody) {
                bb.end(request.rawBody);
            } else {
                request.pipe(bb);
            }
        })
    }

}