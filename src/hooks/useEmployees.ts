// import { useEffect, useState } from 'react';
// import { supabase } from '@/backend/supabase/supabaseClient';
// import type { Database } from '@/../database.types';

// type Employee = Database['public']['Tables']['employees']['Row'];

// export function useEmployees() {
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchEmployees();
//     const subscription = supabase
//       .channel('employees_changes')
//       .on('postgres_changes', 
//         { event: '*', schema: 'public', table: 'employees' }, 
//         (payload) => {
//           fetchEmployees();
//       })
//       .subscribe();

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, []);

//   async function fetchEmployees() {
//     try {
//       const { data, error } = await supabase
//         .from('employees')
//         .select(`
//           *,
//           companies (
//             id,
//             name
//           )
//         `);

//       if (error) throw error;
//       setEmployees(data || []);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return { employees, loading, error };
// }
