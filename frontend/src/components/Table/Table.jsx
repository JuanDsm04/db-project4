import { TableButton } from '../Buttons/TableButton/TableButton';
import './Table.css'

export const Table = ({
    nameColumns,
    data,
    onShowMore
}) => {
    const renderCellContent = (col, item) => {
    if (col.key === 'showMore') {
      return (
        <TableButton
            text = {'Ver más ...'}
            onClick={() => onShowMore(item)}
        ></TableButton>
    
      );
    }

    if (col.key === 'acciones') {
      return (
        <button
          className="buttonEditar"
          onClick={() => onEditar(item.carnet)}
          aria-label={`Editar ${item.carnet}`}
        >
          Editar
        </button>
      );
    }
    return <span>{item[col.key]}</span>;
  };


    return(
        <div>
            {data.length === 0 ? 
            (
                <h1>No hay datos disponibles</h1>
            ):(
                <table>
                    <thead>
                        <tr>
                            {nameColumns.map((col) =>(
                                <th key={col.key}>
                                    {col.titulo}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((item) => (
                            <tr key = {item.id}>
                                {nameColumns.map((col) => (
                                    <td key = {col.key}>
                                        {renderCellContent(col,item)}
                                    </td>
                                ))
                                    
                                }
                            </tr>
                        ))

                        }
                    </tbody>

                </table>

            )}

        </div>
    )
}