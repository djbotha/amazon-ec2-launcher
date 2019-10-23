require('dotenv').config();
const fs = require('fs');
const request = require('request');

if (!process.env.API_SERVER_PREFIX) {
  throw new Error('API server prefix not specified. Ensure the .env file is defined in the project root.');
}

const serverAddress = `${process.env.API_SERVER_PREFIX}:8081`;
const outFile = 'src/static/instance-types.json';

// Ensure the API server is alive
request(serverAddress, (err, res, body) => {
  if (err || !res || !res.statusCode || res.statusCode !== 200 || JSON.parse(body).status !== 'ok') {
    process.stdout.write(`Error communicating with the API server. Please ensure it is running.\n`);
    return;
  }
  process.stdout.write(`API server available, starting collector.\n`);

  // List all instance types
  const instanceTypesDetailed = {};
  process.stdout.write(`Requesting instance types...\n`);
  request(`${serverAddress}/instanceTypes`, (err2, res2, body2) => {
    const bodyInstanceTypes = JSON.parse(body2);
    if (!bodyInstanceTypes || !bodyInstanceTypes.instanceTypes || bodyInstanceTypes.instanceTypes.length === 0) {
      process.stdout.write(`Error receiving instance type list.\n`);
      return;
    }

    const { instanceTypes } = bodyInstanceTypes;
    process.stdout.write(`Received ${instanceTypes.length} instance types, collecting information on each...\n`);

    // Recursively fetch information on each instance type
    const fetchInstanceType = index => {
      // If all instance types have been fetched
      if (index === instanceTypes.length) {
        process.stdout.write(`Complete, written to \`${outFile}\`.\n`);
        fs.writeFileSync(
          outFile,
          JSON.stringify({
            instanceTypes: instanceTypesDetailed
          })
        );
      } else {
        const instanceType = instanceTypes[index];
        request(`${serverAddress}/instanceTypes/${instanceType}`, (err3, res3, body3) => {
          const instanceTypeBody = JSON.parse(body3);

          // If data is available on a particular instance type
          if (instanceTypeBody.data.length !== 0) {
            process.stdout.write(`Fetched ${index + 1} of ${instanceTypes.length}: ${instanceType}\n`);
            const instanceData = instanceTypeBody.data[0];

            // Attempt to get the hourly price
            let onDemandHourlyPrice = null;
            if (instanceData.terms && instanceData.terms.OnDemand) {
              const onDemandObj = instanceData.terms.OnDemand[Object.keys(instanceData.terms.OnDemand)[0]];
              if (onDemandObj.priceDimensions) {
                const onDemandHourlyPriceObj = onDemandObj.priceDimensions[Object.keys(onDemandObj.priceDimensions)[0]].pricePerUnit;
                onDemandHourlyPrice = {
                  currency: Object.keys(onDemandHourlyPriceObj)[0]
                };
                onDemandHourlyPrice.value = onDemandHourlyPriceObj[onDemandHourlyPrice.currency];
              }
            }

            // Collect data
            const instanceTypeData = {
              instanceType,
              family: instanceData.product.productFamily,
              ecu: instanceData.product.attributes.ecu,
              vcpu: instanceData.product.attributes.vcpu,
              physicalProcessor: instanceData.product.attributes.physicalProcessor,
              memory: instanceData.product.attributes.memory,
              storage: instanceData.product.attributes.storage,
              networkPerformance: instanceData.product.attributes.networkPerformance,
              processorArchitecture: instanceData.product.attributes.processorArchitecture,
              onDemandHourlyPrice
            };

            instanceTypesDetailed[instanceType] = instanceTypeData;
          } else {
            process.stdout.write(`No data for ${index + 1} of ${instanceTypes.length}: ${instanceType}\n`);
          }
          fetchInstanceType(index + 1);
        });
      }
    };

    fetchInstanceType(0);
  });
});
