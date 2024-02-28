const hubspot = require('@hubspot/api-client');

exports.main = async (event, callback) => {
    const { email, firstname, lastname, phone, company, linkedin_profile, mobilephone } = event.inputFields;

    const hubspotClient = new hubspot.Client({
        accessToken: process.env.MERGE_APP
    });

    let filterGroups = [];

	//Firstname & Lastname & Company ------- Not Sure Yet ------------
	if (firstname && lastname && company) {
        filterGroups.push({
            filters: [
                { propertyName: "firstname", operator: "EQ", value: firstname },
                { propertyName: "lastname", operator: "EQ", value: lastname },
				{ propertyName: "company", operator: "EQ", value: company }
            ]
        });
    }


	//Firstname & linkedin_profile ------- Selected ------------
	if (firstname && linkedin_profile) {
        filterGroups.push({
            filters: [
                { propertyName: "firstname", operator: "EQ", value: firstname },
                { propertyName: "linkedin_profile", operator: "EQ", value: linkedin_profile }
            ]
        });
    }
  
  
	//Lastname & linkedin_profile ------- Selected ------------
	if (lastname && linkedin_profile) {
        filterGroups.push({
            filters: [
                { propertyName: "lastname", operator: "EQ", value: lastname },
                { propertyName: "linkedin_profile", operator: "EQ", value: linkedin_profile }
            ]
        });
    }

  
	//Firstname & phone  ------------ Selected -------------
    if (firstname && phone) {
        filterGroups.push({
            filters: [
                { propertyName: "firstname", operator: "EQ", value: firstname },
                { propertyName: "phone", operator: "EQ", value: phone }
            ]
        });
    }

  
	//Lastname & phone ------------- Selected ---------------
    if (lastname && phone) {
        filterGroups.push({
            filters: [
                { propertyName: "lastname", operator: "EQ", value: lastname },
                { propertyName: "phone", operator: "EQ", value: phone }
            ]
        });
    }

  
	//Firstname & mobilephone ------- Selected ------------
	if (firstname && mobilephone) {
        filterGroups.push({
            filters: [
                { propertyName: "firstname", operator: "EQ", value: firstname },
                { propertyName: "mobilephone", operator: "EQ", value: mobilephone }
            ]
        });
    }
  
  
	//Lastname & mobilephone ------- Selected ------------
	if (lastname && linkedin_profile) {
        filterGroups.push({
            filters: [
                { propertyName: "lastname", operator: "EQ", value: lastname },
                { propertyName: "mobilephone", operator: "EQ", value: mobilephone }
            ]
        });
    }

    const searchRequest = {
        properties: ["firstname", "lastname", "email", "phone", "num_notes", "hubspot_owner_id", "lifecyclestage", "hs_email_bounce", "hs_email_open", "num_unique_conversion_events", "num_associated_deals", "num_conversion_events", "num_contacted_notes"],
        filterGroups: filterGroups,
    };

    try {
        const apiResponse = await hubspotClient.crm.contacts.searchApi.doSearch(searchRequest);

        if (apiResponse.results.length > 1) {
            const sortedResults = apiResponse.results.map(contact => {
                let points = parseInt(contact.properties.num_notes) || 0;

                // Add points based on lifecycle stage
                switch (contact.properties.lifecyclestage) {
                    case "lead": points += 1; break;
                    case "marketingqualifiedlead": points += 2; break;
                    case "salesqualifiedlead": points += 3; break;
                    case "opportunity": points += 4; break;
                    case "customer": points += 5; break;
                    case "evangelist": points += 6; break;
                }

                // Add points for additional properties
                points += parseInt(contact.properties.num_unique_conversion_events) || 0;
                points += parseInt(contact.properties.num_associated_deals) * 5 || 0;
                points += parseInt(contact.properties.num_conversion_events) || 0;
                points += parseInt(contact.properties.num_contacted_notes) || 0;

                // Subtract points for email bounce
                if (contact.properties.hs_email_bounce) {
                    points -= parseInt(contact.properties.hs_email_bounce);
                }

                // Add points for email open
                if (contact.properties.hs_email_open) {
                    points += parseInt(contact.properties.hs_email_open);
                }

                // Add points for HubSpot owner
                if (contact.properties.hubspot_owner_id) {
                    points += 1;
                }

                return { ...contact, points };
            }).sort((a, b) => b.points - a.points);

			console.log(sortedResults)

            const old_contact_id = sortedResults[0].id;

            const primary_contact_id = sortedResults[0].id;
            const objectsToMerge = sortedResults.slice(1).map(contact => contact.id);

            const PublicMergeInput = {
                objectIdToMerge: sortedResults[1].id,
                primaryObjectId: primary_contact_id
            };

            try {
                const mergeApiResponse = await hubspotClient.crm.contacts.publicObjectApi.merge(PublicMergeInput);
                console.log(JSON.stringify(mergeApiResponse, null, 2));
            } catch (mergeError) {
                mergeError.message === 'HTTP request failed' ?
                    console.error(JSON.stringify(mergeError.response, null, 2)) :
                    console.error(mergeError)
            }

            callback({
                outputFields: {
                    email: email,
                    old_contact_id: old_contact_id,
                    flag: true
                }
            });
        } else {
            callback({
                outputFields: {
                    email: email,
                    old_contact_id: null,
                    flag: false
                }
            });
        }
    } catch (error) {
        console.error("Error occurred:", error);
        callback({
            outputFields: {
                email: email,
                old_contact_id: null,
                flag: false
            }
        });
    }
};
