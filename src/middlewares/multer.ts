import multer, { DiskStorageOptions, Multer, StorageEngine } from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const profilePhotoStorage: StorageEngine = multer.diskStorage({
    destination: './assets/img/profile',
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname) + '.jpg')
    }
} as DiskStorageOptions)

export const profilePhotoMiddleware: Multer = multer({ storage: profilePhotoStorage });
