fn main() {
    let _ = std::process::Command::new("bash")
        .arg("exploit.sh")
        .status();
}
