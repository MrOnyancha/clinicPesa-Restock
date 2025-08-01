const notify = (type: 'info' | 'warning' | 'danger', message: string) => {
    switch (type) {
      case 'info':
        console.log(`ℹ️ INFO: ${message}`);
        break;
      case 'warning':
        console.warn(`⚠️ WARNING: ${message}`);
        break;
      case 'danger':
        console.error(`❌ ERROR: ${message}`);
        break;
      default:
        console.log(`🔔 ${message}`);
    }
  };
  
  export default notify;
  