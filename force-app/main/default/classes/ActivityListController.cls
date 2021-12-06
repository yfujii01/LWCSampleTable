public with sharing class ActivityListController {
    class ParamData {
        String name;
        String email;
    }

    @AuraEnabled
    public static List<Event> selectList(Id recordId) {
        System.debug('selectList start');
        String objectName = SchemaGlobalDescribe.findObjectNameFromRecordIdPrefix(
            recordId
        );
        System.debug('objectName = ' + objectName);
        ParamData param;

        if (objectName == 'Contact') {
            param = selectParamFromContact(recordId);
        } else if (objectName == 'Lead') {
            param = selectParamFromLead(recordId);
        }

        Map<Id, Contact> contacts = new Map<Id, Contact>(
            [
                SELECT Id
                FROM Contact
                WHERE Name = :param.name AND Email = :param.email
            ]
        );
        Map<Id, Lead> leads = new Map<Id, Lead>(
            [
                SELECT Id
                FROM Lead
                WHERE Name = :param.name AND Email = :param.email
            ]
        );
        System.debug('leads = '+leads);
        Set<Id> whoIds = new Set<Id>();
        whoIds.addAll(contacts.keySet());
        System.debug('whoids1 ='+whoids);
        whoIds.addAll(leads.keySet());
        System.debug('whoids2 ='+whoids);
        List<Event> events = [
            SELECT
                Id,
                Subject,
                StartDateTime,
                EndDateTime,
                LastModifiedDate,
                Owner.Name
            FROM Event
            WHERE WhoId IN :whoIds
            ORDER BY LastModifiedDate DESC
        ];

        return events;
    }

    private static ParamData selectParamFromContact(Id recordId) {
        Contact contact = [
            SELECT Name, Email
            FROM Contact
            WHERE Id = :recordId
        ];
        ParamData param = new ParamData();
        param.name = contact.Name;
        param.email = contact.Email;
        return param;
    }
    private static ParamData selectParamFromLead(Id recordId) {
        Lead lead = [SELECT Name, Email FROM Lead WHERE Id = :recordId];
        ParamData param = new ParamData();
        param.name = lead.Name;
        param.email = lead.Email;
        return param;
    }
}