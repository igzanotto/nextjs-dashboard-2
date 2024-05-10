import { createClient } from '@/utils/supabase/server';

    const REPORTS_PER_PAGE = 6;
    export async function fetchFilteredReports(
      query: string,
      currentPage: number
    ) {
      const offset = (currentPage - 1) * REPORTS_PER_PAGE;
    
      try {
        const supabase = createClient();
        const { data: reports, error } = await supabase
          .from('reports')
          .select(
            `
            id,
            buisness_id,
            month
          `,
            { count: 'exact' }
          )
          .ilike('month', `%${query}%`)
          .range(offset, offset + REPORTS_PER_PAGE - 1);
    
        if (error) {
          throw new Error('Failed to fetch reports.');
        }
        console.log("reports", reports);
        
        return reports;
      } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch reports.');
      }
    }




  export async function fetchReportById(reportId:string) {
    try {
      const supabase = createClient();
      const { data: report} = await supabase.from("reports").select().eq('id', reportId).single();    
      return report;
    } catch (error) {
      console.error('Failed to fetch report by id:', error);
    }
  }

  export async function fetchReportByBuisnessId(reportId:string) {
    try {
      const supabase = createClient();
      const { data: reportByBuisnessId} = await supabase.from("reports").select().eq('buisness_id', reportId).single();  
      return reportByBuisnessId;
    } catch (error) {
      console.error('Failed to fetch report by id:', error);
    }
  }

  export async function fetchReportsWithBusinesses() {
    try {
      const supabase = createClient();
  
      // Obtener los IDs de los negocios
      const { data: businessIds, error: businessError } = await supabase
        .from('buisnesses')
        .select('id');
  
      if (businessError) {
        throw new Error('Failed to fetch business IDs.');
      }
  
      // Extraer los IDs en un array
      const ids = businessIds.map((business) => business.id);
  
      // Consulta principal para obtener los informes con los negocios asociados
      const { data: reports, error: reportError } = await supabase
        .from('reports')
        .select(`
          *,
          buisness_id(*)
        `)
        .in('buisness_id', ids);
  
      if (reportError) {
        throw new Error('Failed to fetch reports with associated businesses.');
      }
      console.log("Reportesss: ", reports);
      
      return reports;
    } catch (error) {
      console.error('Failed to fetch reports with associated businesses:', error);
      throw new Error('Failed to fetch reports with associated businesses.');
    }
  }


  export async function fetchBuisnesses() {
      try {
        const supabase = createClient();
        const { data: buisnesses, error } = await supabase.from("buisnesses").select();
    
        if (error) {
          throw new Error('Failed to fetch buisnesses.');
        }
    
        return buisnesses;
      } catch (error) {
        console.error('Failed to fetch buisnesses:', error);
        throw new Error('Failed to fetch buisnesses.');
      }
    }

    export async function fetchBusinessById(companyId:string) {
      try {
        const supabase = createClient();
        const { data: company, error } = await supabase.from("buisnesses").select().eq('id', companyId).single();
        
        if (error) {
          throw new Error('Failed to fetch company.');
        }
        
        return company;
      } catch (error) {
        console.error('Failed to fetch company:', error);
      }
    }



    const ITEMS_PER_PAGE = 6;
    export async function fetchFilteredBusiness(
      query: string,
      currentPage: number
    ) {
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    
      try {
        const supabase = createClient();
        const { data: businesses, error } = await supabase
          .from('buisnesses')
          .select(
            `
            id,
            name
          `,
            { count: 'exact' }
          )
          .ilike('name', `%${query}%`)
          .range(offset, offset + ITEMS_PER_PAGE - 1);
    
        if (error) {
          throw new Error('Failed to fetch businesses.');
        }
    
        console.log("businesses", businesses);
        
        return businesses;
      } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch businesses.');
      }
    }

    export async function fetchBusinessPages(query: string) {
      try {
        const supabase = createClient();
        const { data: buisnesses, error } = await supabase
          .from('buisnesses')
          .select(
            `
            id,
            name
          `,
            { count: 'exact' }
          )
          .ilike('name', `%${query}%`)
          
        const count = buisnesses ? buisnesses.length : 0;
        const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
        console.log("total pages", totalPages);
        return totalPages;
      } catch (error) {
        console.error('Error:', error);
        console.log("Salio mal", error);
        
      }
    }