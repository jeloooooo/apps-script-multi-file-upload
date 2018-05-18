function doGet() {
	return HtmlService.createHtmlOutputFromFile('form').setSandboxMode(
			HtmlService.SandboxMode.IFRAME);
}

function createFolder(parentFolderId, folderName) {
	try {
		var parentFolder = DriveApp.getFolderById(parentFolderId);
		var folders = parentFolder.getFoldersByName(folderName);
		var folder;
		if (folders.hasNext()) {
			folder = folders.next();
		} else {
			folder = parentFolder.createFolder(folderName);
		}
		return {
			'folderId' : folder.getId()
		}
	} catch (e) {
		return {
			'error' : e.toString()
		}
	}
}

function uploadFile(base64Data, fileName, folderId) {
	try {
		var splitBase = base64Data.split(','), type = splitBase[0].split(';')[0]
				.replace('data:', '');
		var byteCharacters = Utilities.base64Decode(splitBase[1]);
		var ss = Utilities.newBlob(byteCharacters, type);
		ss.setName(fileName);

		var folder = DriveApp.getFolderById(folderId);
		var files = folder.getFilesByName(fileName);
		var file;
		while (files.hasNext()) {
			// delete existing files with the same name.
			file = files.next();
			folder.removeFile(file);
		}
		file = folder.createFile(ss);
		return {
			'folderId' : folderId,
			'fileName' : file.getName()
		};
	} catch (e) {
		return {
			'error' : e.toString()
		};
	}
}