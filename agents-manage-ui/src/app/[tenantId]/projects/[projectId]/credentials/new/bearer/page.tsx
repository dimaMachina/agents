import { NewCredentialForm } from '@/components/credentials/views/new-credential-form';

async function NewBearerCredentialsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <NewCredentialForm />
    </div>
  );
}

export default NewBearerCredentialsPage;
