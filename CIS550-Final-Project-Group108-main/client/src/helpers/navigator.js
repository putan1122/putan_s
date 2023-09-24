import { NavLink, useNavigate } from 'react-router-dom';

export function CustomNavLink(props) {
    const history = useNavigate();
    
    const handleClick = () => {
      history.push(`/search_books/${props.params.row.book_id}`, { from: props.location.pathname });
    };
  
    return (
      <NavLink to={`/search_books/${props.params.row.book_id}`} onClick={handleClick}>
        {props.params.value}
      </NavLink>
    );
  }