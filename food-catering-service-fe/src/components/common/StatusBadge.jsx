import { Chip } from '@mui/material';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CancelIcon from '@mui/icons-material/Cancel';

export const StatusBadge = ({ status, size = 'medium' }) => {
  let bg = '#FEF3C7';
  let color = '#92400E';
  let Icon = AccessTimeFilledIcon;
  let label = status;

  switch (status) {
    case 'Pending':
    case 'New':
      bg = '#FFEDD5';
      color = '#C2410C';
      Icon = AccessTimeFilledIcon;
      label = status === 'New' ? 'New' : 'Pending';
      break;
    case 'Preparing':
      bg = '#FEF08A';
      color = '#854D0E';
      Icon = LocalFireDepartmentIcon;
      break;
    case 'Ready':
      bg = '#DCFCE7';
      color = '#15803D';
      Icon = CheckCircleIcon;
      break;
    case 'Completed':
      bg = '#E2E8F0';
      color = '#334155';
      Icon = TaskAltIcon;
      break;
    case 'Cancelled':
      bg = '#FEE2E2';
      color = '#991B1B';
      Icon = CancelIcon;
      break;
    default:
      break;
  }

  return (
    <Chip
      size={size}
      icon={<Icon style={{ color: 'inherit', fontSize: size === 'small' ? 14 : 16 }} />}
      label={label}
      sx={{
        backgroundColor: bg,
        color: color,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.8125rem',
        height: size === 'small' ? 24 : 28,
        borderRadius: '9999px',
        transition: 'all 0.3s ease',
        '& .MuiChip-label': {
          px: 1,
        },
      }}
    />
  );
};
