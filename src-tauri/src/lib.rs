pub mod commands;
pub mod models;
pub mod services;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            app.handle().plugin(
                tauri_plugin_log::Builder::default()
                    .level(log::LevelFilter::Info)
                    .build(),
            )?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Project history commands
            commands::get_project_history,
            commands::add_project_to_history,
            commands::clear_project_history,
            // File system commands
            commands::read_directory_tree,
            commands::read_file_content,
            commands::write_file_content,
            commands::create_dir,
            commands::save_binary_file,
            commands::search_content,
            commands::export_markdown,
            commands::create_new_file,
            commands::copy_file,
            commands::rename_file,
            commands::delete_file,
            // Knowledge base commands
            commands::create_knowledge_base,
            commands::list_knowledge_bases,
            commands::get_knowledge_base,
            commands::delete_knowledge_base,
            commands::import_documents,
            commands::get_documents,
            commands::delete_document
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
