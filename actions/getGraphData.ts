import { prisma } from "../libs/prismadb";
import moment from "moment";

export default async function getGraphData() {
  try {
    const startDate = moment().subtract(6, "days").startOf("day");
    const endDate = moment().endOf("day");
    const result = await prisma.order.groupBy({
      by: ["createDate"],
      where: {
        createDate: {
          gte: startDate.toISOString(),
          lte: endDate.toISOString(),
        },
        status:'complete'
      },
      _sum: {
        amount:true,
      },
    });

    //initialize an object to aggregate the data by day

    const aggregateData: {
      [day: string]: { day: string, date: string, totalAmount: number };
    } = {}

    //create a clone of the start date to iterate over each day
    const currentDate = startDate.clone();

    //iterate over each day in the date range
    while (currentDate <= endDate) {
      //format the day as a string (e.g.) Monday  
      const day = currentDate.format('dddd');

      // initialize the aggregate data for the day with the day, date and total amount
      aggregateData[day] = {
        day,
        date: currentDate.format('YYYY-MM-DD'),
        totalAmount: 0,
      };

      // move to the next day 
      currentDate.add(1, "day");
    }

    //calculate the total amount for each day by summing the order amounts
    result.forEach((entry) => {
      const day = moment(entry.createDate).format('dddd');
      const amount = entry._sum.amount || 0;
      aggregateData[day].totalAmount += amount;
    });
  
    //convert the aggregate data object to an array and sort it by date
    const formattedData = Object.values(aggregateData).sort((a, b) => moment(a.date).diff(moment(b.date)));
    return formattedData;
  } catch (error:any) {
    throw new Error(error);
  }
}