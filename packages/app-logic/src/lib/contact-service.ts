import { ContactRepository, TrackerDatabase } from '@contact-tracker/data-access';

export class ContactService {
  constructor(
    private repository: ContactRepository,
    private db: TrackerDatabase,
  ) {}
}
