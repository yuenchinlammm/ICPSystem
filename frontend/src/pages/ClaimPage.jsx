import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import ClaimForm from './ClaimForm';

export default function CreateClaimPage() {
  const navigate = useNavigate();

  const create = async (form) => {
    try {
      const { data } = await api.post('/api/claims', form);
      // redirect to detail or list
      navigate(`/claims/${data._id}`);
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.message;
      alert(`Create failed: ${msg}`);
    }
  };

  return (
    <div>
      <h1>New Claim</h1>
      <ClaimForm onSubmit={create} />
    </div>
  );
}
