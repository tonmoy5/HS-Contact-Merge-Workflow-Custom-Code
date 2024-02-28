# Contact Merge Workflow Documentation

## Overview
This document provides an overview of the contact merge workflow implemented using the HubSpot API. The workflow aims to identify and merge duplicate contacts based on specified criteria.

## Workflow Description
The contact merge workflow consists of the following steps:

- **Input Fields**: Accepts input fields such as email, firstname, lastname, phone, company, linkedin_profile, Mobilephone.
- **Filtering Criteria**: Filters contacts based on various combinations of input fields to identify potential duplicates.
- **Search API**: Utilizes the HubSpot CRM contacts search API to retrieve contacts matching the filtering criteria.
- **Points Calculation**: Calculates points for each contact based on specified properties such as num_notes, lifecyclestage, num_unique_conversion_events, etc.
- **Sorting**: Sorts contacts in descending order based on points to identify the primary contact and potential duplicates.
- **Merge Operation**: Performs the merge operation to merge the duplicate contacts into the primary contact.

## Input Fields
- **Email**: Email address of the contact.
- **Firstname**: First name of the contact.
- **Lastname**: Last name of the contact.
- **Phone**: Phone number of the contact.
- **Company**: Company name of the contact.
- **Linkedin Profile**: LinkedIn profile URL of the contact.
- **Mobilephone**: Mobile phone number of the contact.

## Filtering Criteria
The workflow applies various filtering criteria to identify potential duplicate contacts:
- Combination of firstname, lastname, and company.
- Combination of firstname and linkedin_profile.
- Combination of lastname and linkedin_profile.
- Combination of firstname and phone.
- Combination of lastname and phone.
- Combination of firstname and mobilephone.
- Combination of lastname and mobilephone.

## Points Calculation
- **num_notes**: Number of notes associated with the contact.
- **lifecyclestage**: Current lifecycle stage of the contact.
- **num_unique_conversion_events**: Number of unique conversion events associated with the contact.
- **num_associated_deals**: Number of deals associated with the contact.
- **num_conversion_events**: Total number of conversion events associated with the contact.
- **num_contacted_notes**: Number of contacted notes associated with the contact.

## Merge Operation
The primary contact is determined based on the highest points calculated, and the merge operation is performed to merge the duplicate contacts into the primary contact.

## Error Handling
The workflow includes error handling to handle exceptions that may occur during the execution of API requests or merge operations.
