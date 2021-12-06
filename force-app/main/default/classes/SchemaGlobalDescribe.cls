public class SchemaGlobalDescribe {
    public static String findObjectNameFromRecordIdPrefix(
        String recordIdOrPrefix
    ) {
        String idPrefix = recordIdOrPrefix.substring(0, 3);
        for (Schema.SObjectType stype : Schema.getGlobalDescribe().values()) {
            Schema.DescribeSObjectResult r = stype.getDescribe();
            String prefix = r.getKeyPrefix();
            if (idPrefix == prefix) {
                return r.getName();
            }
        }
        return '';
    }
}