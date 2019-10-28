import React, { useEffect } from 'react';
import { Table, TableHead, TableRow, TableCell, Typography, TableBody, IconButton } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import { useInstance } from '../context/InstanceContext';
import useAPI from '../hooks/useAPI';

import Loading from './common/Loading';
import Error from './common/Error';

function KeyPairs() {
  const { dispatch } = useInstance();
  const [{ data, error, loading }] = useAPI('/keyPairs');

  useEffect(() => {}, [dispatch]);

  if (loading) return <Loading />;
  if (error && error.message) return <Error error={error.message} />;

  const keypairs = (data && data.data) || [];

  const selectKeyPair = idx => {
    dispatch({ type: 'KEY_PAIR', payload: { keypairName: keypairs[idx] } });
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <Typography>Name</Typography>
          </TableCell>
          <TableCell>
            <Typography>Select</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {keypairs.map((kp, idx) => (
          <TableRow hover key={kp}>
            <TableCell>{kp}</TableCell>
            <TableCell>
              <IconButton color="primary" onClick={() => selectKeyPair(idx)}>
                <AddCircleIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default KeyPairs;
