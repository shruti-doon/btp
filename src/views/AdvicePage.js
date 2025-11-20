import { useParams } from 'react-router-dom';

const AdvicePage = () => {
  const { disId } = useParams(); // eslint-disable-line no-unused-vars
  // Use disId to fetch or display the appropriate advice
  return <div>Advice Page for Disease ID: {disId}</div>;
};

export default AdvicePage;