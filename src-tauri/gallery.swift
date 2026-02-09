#!/usr/bin/swift
import Foundation
import ImageCaptureCore

class ButlerGallery: NSObject, ICDeviceBrowserDelegate, ICDeviceDelegate, ICCameraDeviceDelegate {
    var keepRunning = true
    let browser = ICDeviceBrowser()
    
    override init() {
        super.init()
        browser.delegate = self
        browser.start()
    }
    
    // MARK: - ICDeviceBrowserDelegate
    
    func deviceBrowser(_ browser: ICDeviceBrowser, didAdd device: ICDevice, moreComing: Bool) {
        if (device.type == .camera) {
            guard let camera = device as? ICCameraDevice else { return }
            camera.delegate = self
            camera.requestOpenSession()
        }
    }
    
    func deviceBrowser(_ browser: ICDeviceBrowser, didRemove device: ICDevice, moreGoing: Bool) { }

    // MARK: - ICDeviceDelegate
    
    func device(_ device: ICDevice, didOpenSessionWithError error: Error?) {
        if let error = error {
            printJSON(error: "Error abriendo sesión: \(error.localizedDescription)")
            quit()
            return
        }
    }
    
    func device(_ device: ICDevice, didCloseSessionWithError error: Error?) { }
    
    func didRemove(_ device: ICDevice) { }
    
    // MARK: - ICCameraDeviceDelegate
    
    func deviceDidBecomeReady(withCompleteContentCatalog device: ICCameraDevice) {
        processCatalog(device: device)
    }
    
    // MÉTODO QUE FALTABA (Obligatorio en nuevos macOS)
    func cameraDevice(_ camera: ICCameraDevice, didReceivePTPEvent eventData: Data) { }
    
    func cameraDevice(_ camera: ICCameraDevice, didAdd items: [ICCameraItem]) { }
    func cameraDevice(_ camera: ICCameraDevice, didRemove items: [ICCameraItem]) { }
    func cameraDevice(_ camera: ICCameraDevice, didReceiveThumbnail thumbnail: CGImage?, for item: ICCameraItem, error: Error?) { }
    func cameraDevice(_ camera: ICCameraDevice, didReceiveMetadata metadata: [AnyHashable : Any]?, for item: ICCameraItem, error: Error?) { }
    func cameraDevice(_ camera: ICCameraDevice, didRenameItems items: [ICCameraItem]) { }
    func cameraDeviceDidChangeCapability(_ camera: ICCameraDevice) { }
    func cameraDeviceDidEnableAccessRestriction(_ device: ICDevice) { }
    func cameraDeviceDidRemoveAccessRestriction(_ device: ICDevice) { }
    
    // MARK: - Lógica Principal
    
    func processCatalog(device: ICCameraDevice) {
        guard let files = device.mediaFiles else {
            printJSON(data: [])
            quit()
            return
        }
        
        let simpleFiles = files.compactMap { item -> [String: Any]? in
            guard let file = item as? ICCameraFile else { return nil }
            
            return [
                "name": file.name ?? "Sin nombre",
                "size": file.fileSize,
                "type": file.uti ?? "unknown",
                "date": file.creationDate?.timeIntervalSince1970 ?? 0,
                // Usamos hashValue como ID temporal para evitar el error de objectID
                "id": file.name?.hashValue ?? Int.random(in: 0...999999)
            ]
        }
        
        printJSON(data: simpleFiles)
        device.requestCloseSession()
        quit()
    }
    
    // MARK: - Helpers
    
    func printJSON(data: Any) {
        let response: [String: Any] = ["success": true, "files": data]
        if let jsonData = try? JSONSerialization.data(withJSONObject: response, options: []),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            print(jsonString)
        }
    }
    
    func printJSON(error: String) {
        let response: [String: Any] = ["success": false, "error": error]
        if let jsonData = try? JSONSerialization.data(withJSONObject: response, options: []),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            print(jsonString)
        }
    }
    
    func quit() {
        keepRunning = false
    }
}

let tool = ButlerGallery()
let runLoop = RunLoop.current
while tool.keepRunning && runLoop.run(mode: .default, before: Date.distantFuture) {}